package mn.num.edu.thesis_service.adapter.in.web;

import mn.num.edu.thesis_service.adapter.out.persistence.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/thesis-reports")
public class ThesisReportController {

    private final ThesisReportR2dbcRepository reportRepo;
    private final ReportFileR2dbcRepository fileRepo;

    @Value("${app.upload.dir:${java.io.tmpdir}/thesis-uploads/reports}")
    private String uploadDir;

    public ThesisReportController(ThesisReportR2dbcRepository reportRepo,
                                   ReportFileR2dbcRepository fileRepo) {
        this.reportRepo = reportRepo;
        this.fileRepo = fileRepo;
    }

    @GetMapping
    public Flux<ThesisReportEntity> list(
            @RequestParam(required = false) String thesisId,
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String defenseSessionId
    ) {
        if (thesisId != null) return reportRepo.findByThesisId(thesisId);
        if (studentId != null) return reportRepo.findByStudentId(studentId);
        if (defenseSessionId != null) return reportRepo.findByDefenseSessionId(defenseSessionId);
        return reportRepo.findAll();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ThesisReportEntity>> getById(@PathVariable String id) {
        return reportRepo.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/files")
    public Flux<ReportFileEntity> getFiles(@PathVariable String id) {
        return fileRepo.findByReportId(id);
    }

    /**
     * POST /api/thesis-reports — student submits a new report
     */
    @PostMapping
    public Mono<ResponseEntity<ThesisReportEntity>> submit(@RequestBody SubmitReportRequest req) {
        ThesisReportEntity entity = new ThesisReportEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setNew(true);
        entity.setThesisId(req.thesisId());
        entity.setStudentId(req.studentId());
        entity.setDefenseSessionId(req.defenseSessionId());
        entity.setReportType(req.reportType());
        entity.setSubmissionNumber(req.submissionNumber() != null ? req.submissionNumber() : 1);
        entity.setStatus("SUBMITTED");
        entity.setSubmittedAt(LocalDateTime.now());
        return reportRepo.save(entity)
                .map(saved -> ResponseEntity.status(HttpStatus.CREATED).body(saved));
    }

    /**
     * POST /api/thesis-reports/{id}/upload — student uploads file for a report
     */
    @PostMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ReportFileEntity>> uploadFile(
            @PathVariable String id,
            @RequestPart("file") FilePart filePart
    ) {
        return reportRepo.findById(id)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Report not found: " + id)))
                .flatMap(report -> {
                    String filename = UUID.randomUUID() + "_" + filePart.filename();
                    Path dir = Paths.get(uploadDir, report.getThesisId(), id);
                    Path storedPath = dir.resolve(filename);

                    return Mono.fromCallable(() -> { dir.toFile().mkdirs(); return storedPath; })
                            .flatMap(path -> filePart.transferTo(path.toFile()).thenReturn(path))
                            .flatMap(path -> {
                                ReportFileEntity file = new ReportFileEntity();
                                file.setId(UUID.randomUUID().toString());
                                file.setNew(true);
                                file.setReportId(id);
                                file.setOriginalFilename(filePart.filename());
                                file.setStoredPath(path.toString());
                                file.setMimeType(filePart.headers().getContentType() != null
                                        ? filePart.headers().getContentType().toString() : null);
                                file.setUploadedAt(LocalDateTime.now());
                                return fileRepo.save(file);
                            })
                            .map(saved -> ResponseEntity.status(HttpStatus.CREATED).body(saved));
                });
    }

    /**
     * GET /api/thesis-reports/files/{fileId}/download
     */
    @GetMapping("/files/{fileId}/download")
    public Mono<ResponseEntity<FileSystemResource>> download(@PathVariable String fileId) {
        return fileRepo.findById(fileId)
                .map(f -> {
                    File file = new File(f.getStoredPath());
                    if (!file.exists()) return ResponseEntity.notFound().<FileSystemResource>build();
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION,
                                    "attachment; filename=\"" + f.getOriginalFilename() + "\"")
                            .contentType(MediaType.APPLICATION_OCTET_STREAM)
                            .body(new FileSystemResource(file));
                })
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /api/thesis-reports/{id}/review — supervisor/committee reviews the report
     */
    @PatchMapping("/{id}/review")
    public Mono<ResponseEntity<ThesisReportEntity>> review(@PathVariable String id,
                                                            @RequestBody ReviewReportRequest req) {
        return reportRepo.findById(id)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Report not found")))
                .flatMap(report -> {
                    report.setStatus(req.decision());
                    report.setReviewedBy(req.reviewedBy());
                    report.setReviewedAt(LocalDateTime.now());
                    report.setSupervisorNotes(req.notes());
                    report.setUpdatedAt(LocalDateTime.now());
                    report.setNew(false);
                    return reportRepo.save(report);
                })
                .map(ResponseEntity::ok);
    }

    public record SubmitReportRequest(String thesisId, String studentId, String defenseSessionId,
                                       String reportType, Integer submissionNumber) {}
    public record ReviewReportRequest(String reviewedBy, String decision, String notes) {}
}
