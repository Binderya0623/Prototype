package mn.num.edu.workflow_service.adapters.in.web;

import mn.num.edu.workflow_service.adapters.out.persistence.entity.DefenseSessionEntity;
import mn.num.edu.workflow_service.adapters.out.persistence.repository.DefenseSessionR2dbcRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/defense-sessions")
public class DefenseSessionController {

    private final DefenseSessionR2dbcRepository repository;

    public DefenseSessionController(DefenseSessionR2dbcRepository repository) {
        this.repository = repository;
    }

    private static final Map<String, BigDecimal> STAGE_MAX_POINTS = Map.of(
            "PROGRESS_1", BigDecimal.valueOf(15),
            "PROGRESS_2", BigDecimal.valueOf(20),
            "PRELIMINARY", BigDecimal.valueOf(25),
            "FINAL", BigDecimal.valueOf(35)
    );

    @GetMapping
    public Flux<DefenseSessionEntity> listAll(@RequestParam(required = false) String committeeId,
                                              @RequestParam(required = false) String departmentId,
                                              @RequestParam(required = false) String status) {
        if (committeeId != null) return repository.findByCommitteeId(committeeId);
        if (departmentId != null) return repository.findByDepartmentId(departmentId);
        if (status != null) return repository.findByStatus(status);
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<DefenseSessionEntity>> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-committee-stage")
    public Mono<ResponseEntity<DefenseSessionEntity>> getByCommitteeStage(
            @RequestParam String committeeId, @RequestParam String stageType) {
        return repository.findByCommitteeIdAndStageType(committeeId, stageType)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<DefenseSessionEntity>> create(@RequestBody CreateDefenseSessionRequest req) {
        if (!STAGE_MAX_POINTS.containsKey(req.stageType())) {
            return Mono.just(ResponseEntity.badRequest().<DefenseSessionEntity>build());
        }
        BigDecimal maxPts = req.maxPoints() != null ? req.maxPoints() : STAGE_MAX_POINTS.get(req.stageType());

        DefenseSessionEntity entity = new DefenseSessionEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setNew(true);
        entity.setDepartmentId(req.departmentId());
        entity.setCommitteeId(req.committeeId());
        entity.setStageType(req.stageType());
        entity.setMaxPoints(maxPts);
        entity.setStatus("PENDING");
        entity.setCreatedAt(LocalDateTime.now());

        return repository.save(entity)
                .map(saved -> ResponseEntity.status(HttpStatus.CREATED).body(saved));
    }

    @PatchMapping("/{id}/open")
    public Mono<ResponseEntity<DefenseSessionEntity>> open(@PathVariable String id,
                                                           @RequestBody OpenCloseRequest req) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Defense session not found")))
                .flatMap(e -> {
                    if (!"PENDING".equals(e.getStatus()))
                        return Mono.error(new IllegalStateException("Session is not PENDING"));
                    e.setStatus("ACTIVE");
                    e.setStartedBy(req.actorId());
                    e.setStartedAt(LocalDateTime.now());
                    e.setNew(false);
                    return repository.save(e);
                })
                .map(ResponseEntity::ok);
    }

    @PatchMapping("/{id}/close")
    public Mono<ResponseEntity<DefenseSessionEntity>> close(@PathVariable String id,
                                                            @RequestBody OpenCloseRequest req) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Defense session not found")))
                .flatMap(e -> {
                    if (!"ACTIVE".equals(e.getStatus()))
                        return Mono.error(new IllegalStateException("Session is not ACTIVE"));
                    e.setStatus("CLOSED");
                    e.setClosedBy(req.actorId());
                    e.setClosedAt(LocalDateTime.now());
                    e.setNew(false);
                    return repository.save(e);
                })
                .map(ResponseEntity::ok);
    }

    public record CreateDefenseSessionRequest(String departmentId, String committeeId,
                                               String stageType, BigDecimal maxPoints) {}
    public record OpenCloseRequest(String actorId) {}
}
