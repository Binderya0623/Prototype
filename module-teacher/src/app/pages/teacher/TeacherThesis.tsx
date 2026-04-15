/**
 * TeacherThesis.tsx
 *
 * This page no longer owns any thesis logic.
 * It dynamically loads ThesisView from module-thesis via Module Federation,
 * passes teacher-specific props, and handles the loading / error states.
 *
 * Flow:
 *   module-teacher → (lazy import at runtime) → module_thesis/ThesisView
 *                                              ↳ (consumes) → shared_ui/SharedUI
 */
import React, { Suspense } from 'react';
import { Spin, Alert, Button } from 'antd';

// ── Type-only import so TypeScript knows the prop shape ─────────────────────
// The actual module is loaded at runtime by Vite federation.
import type { ThesisViewProps } from 'module_thesis/ThesisView';

// ── Runtime dynamic import ───────────────────────────────────────────────────
// 'module_thesis/ThesisView' resolves to http://localhost:3013 at runtime.
// During build, Vite federation replaces this with a remoteEntry.js fetch.
const RemoteThesisView = React.lazy(
  () => import('module_thesis/ThesisView')
);

// ── Mock data — replace with API calls in the next sprint ───────────────────
const SUPERVISED_STUDENTS: ThesisViewProps['students'] = [
  {
    id: 1,
    name: 'Д.Оч',
    thesisTitle: 'Дүрс таних системд CNN ашиглах',
    stage: 'Явц 2',
    status: 'Submitted',
    progress: 80,
    lastSubmission: '2 өдрийн өмнө',
  },
  {
    id: 2,
    name: 'Б.Батбаяр',
    thesisTitle: 'Байгалийн хэлний боловсруулалт',
    stage: 'Урьдчилсан хамгаалалт',
    status: 'Revision Required',
    progress: 65,
    lastSubmission: '3 өдрийн өмнө',
  },
  {
    id: 3,
    name: 'С.Мөнхбаяр',
    thesisTitle: 'IoT мэдрэгчийн сүлжээ',
    stage: 'Явц 1',
    status: 'In Progress',
    progress: 40,
    lastSubmission: 'Өнөөдөр',
  },
  {
    id: 4,
    name: 'Т.Түвшинбаяр',
    thesisTitle: 'Блокчейн аюулгүй байдал',
    stage: 'Сэдвийн зөвшөөрөл',
    status: 'Approved',
    progress: 20,
    lastSubmission: '1 долоо хоногийн өмнө',
  },
];

// ── Error boundary ─────────────────────────────────────────────────────────
class ThesisLoadError extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          type="error"
          message="Thesis module ачаалагдсангүй"
          description={
            <>
              <p style={{ margin: '8px 0' }}>
                module-thesis сервер ажиллаж байгаа эсэхийг шалгана уу:{' '}
                <code>npm run dev</code> (port 3013).
              </p>
              <Button size="small" onClick={() => window.location.reload()}>
                Дахин оролдох
              </Button>
            </>
          }
          showIcon
        />
      );
    }
    return this.props.children;
  }
}

// ── Page component ──────────────────────────────────────────────────────────

export default function TeacherThesis() {
  const handleReviewReport = (studentId: number) => {
    // TODO: open review drawer / navigate to review page
    console.log('Review report for student', studentId);
  };

  return (
    <ThesisLoadError>
      <Suspense
        fallback={
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <Spin size="large" tip="Thesis module ачаалж байна..." />
          </div>
        }
      >
        <RemoteThesisView
          role="teacher"
          students={SUPERVISED_STUDENTS}
          onReviewReport={handleReviewReport}
        />
      </Suspense>
    </ThesisLoadError>
  );
}
