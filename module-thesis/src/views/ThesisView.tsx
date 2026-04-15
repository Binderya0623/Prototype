import React, { useState } from 'react';
import { Card, Progress, Steps, Avatar, Tag, Typography, Flex, Statistic, Button } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  CalendarOutlined,
  BankOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

// Import shared components via Module Federation
// (resolved to shared_ui/SharedUI at runtime by Vite federation)
import { PageHeader, PortalTabs, StatusBadge, DataTable } from 'shared_ui/SharedUI';
import type { TableColumnType } from 'shared_ui/SharedUI';

const { Title, Text, Paragraph } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThesisRole = 'student' | 'teacher';

export interface ThesisViewProps {
  /**
   * 'student' → shows submission controls + progress.
   * 'teacher' → shows review controls + student list.
   */
  role: ThesisRole;
  /** The thesis record injected by the host module */
  thesis?: ThesisRecord;
  /** For teacher role: list of supervised students */
  students?: StudentRecord[];
  onReviewReport?: (studentId: number) => void;
  onSubmitReport?: () => void;
}

interface ThesisRecord {
  title: string;
  description: string;
  supervisor: string;
  department: string;
  researchArea: string;
  submissionDate: string;
  status: string;
  progress: number;
  committee: string[];
}

interface StudentRecord {
  id: number;
  name: string;
  thesisTitle: string;
  stage: string;
  status: string;
  progress: number;
  lastSubmission: string;
}

// ─── Static fallback data (replaced by real API data later) ──────────────────

const DEFAULT_THESIS: ThesisRecord = {
  title: 'Эмнэлгийн зургийн оношлогоонд гүн суралцахуй',
  description:
    'Конволюцын нейрон сүлжээ ашиглан эмнэлгийн зургийн оношлогооны нарийвчлалыг дээшлүүлэхэд гүн суралцахуйн арга техникийг хэрэглэх тухай цогц судалгаа.',
  supervisor: 'Д.Сувдаа',
  department: 'Компьютерын ухаан',
  researchArea: 'Эрүүл мэндэд хиймэл оюун ухаан',
  submissionDate: '2026-06-30',
  status: 'In Progress',
  progress: 75,
  committee: ['Д.Сувдаа', 'Б.Батням'],
};

const STAGES = [
  { title: 'Сэдвийн зөвшөөрөл', status: 'finish'  },
  { title: 'Явц 1',             status: 'finish'  },
  { title: 'Явц 2',             status: 'finish'  },
  { title: 'Урьдчилсан',        status: 'process' },
  { title: 'Эцсийн',            status: 'wait'    },
] as const;

// ─── Teacher view: student list table ─────────────────────────────────────────

function TeacherStudentTable({
  students,
  onReview,
}: {
  students: StudentRecord[];
  onReview?: (id: number) => void;
}) {
  const columns: TableColumnType<StudentRecord>[] = [
    {
      title: 'Оюутан',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Flex align="center" gap={8}>
          <Avatar size={32} style={{ background: '#e0e7ff', color: '#1455BD', fontWeight: 700 }}>
            {name.split('.').map((s) => s[0]).join('')}
          </Avatar>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
        </Flex>
      ),
    },
    {
      title: 'Сэдэв',
      dataIndex: 'thesisTitle',
      key: 'thesisTitle',
      ellipsis: true,
    },
    {
      title: 'Шат',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => <Tag>{stage}</Tag>,
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status as any} />,
    },
    {
      title: 'Дэвшил',
      dataIndex: 'progress',
      key: 'progress',
      width: 140,
      render: (pct: number) => (
        <Flex align="center" gap={8}>
          <Progress percent={pct} size="small" style={{ flex: 1 }} />
        </Flex>
      ),
    },
    {
      title: 'Сүүлийн илгээлт',
      dataIndex: 'lastSubmission',
      key: 'lastSubmission',
      render: (d: string) => <Text type="secondary" style={{ fontSize: 12 }}>{d}</Text>,
    },
  ];

  return (
    <DataTable<StudentRecord>
      columns={columns}
      dataSource={students}
      rowKey="id"
      searchable
      searchPlaceholder="Оюутан хайх..."
      searchFields={['name', 'thesisTitle']}
      actions={[
        {
          label: 'Тайлан хянах',
          icon: <FileTextOutlined />,
          onClick: (r) => onReview?.(r.id),
        },
      ]}
    />
  );
}

// ─── Student view: thesis info + progress ─────────────────────────────────────

function StudentOverviewTab({ thesis }: { thesis: ThesisRecord }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Progress card */}
        <Card>
          <Title level={5} style={{ marginBottom: 16 }}>Нийт дэвшил</Title>
          <Progress
            percent={thesis.progress}
            strokeColor={{ '0%': '#1455BD', '100%': '#3b82f6' }}
            style={{ marginBottom: 24 }}
          />
          <Steps
            current={STAGES.findIndex((s) => s.status === 'process')}
            size="small"
            items={STAGES.map((s) => ({
              title: s.title,
              status: s.status,
              icon:
                s.status === 'finish'  ? <CheckCircleOutlined style={{ color: '#1455BD' }} /> :
                s.status === 'process' ? <ClockCircleOutlined style={{ color: '#1455BD' }} /> :
                                         <MinusCircleOutlined style={{ color: '#94a3b8' }} />,
            }))}
          />
        </Card>

        {/* Committee */}
        <Card title={<><TeamOutlined style={{ color: '#1455BD', marginRight: 8 }} />Комисс</>}>
          <Flex wrap="wrap" gap={12}>
            {thesis.committee.map((member, i) => (
              <Flex key={i} align="center" gap={8}
                style={{ padding: '8px 12px', border: '1px solid #f1f5f9', borderRadius: 8, background: '#fafafa' }}>
                <Avatar size={36} style={{ background: '#e0e7ff', color: '#1455BD', fontWeight: 700 }}>
                  {member.split(' ').map((n) => n[0]).join('')}
                </Avatar>
                <div>
                  <Text strong style={{ fontSize: 13 }}>{member}</Text>
                  <div><Text type="secondary" style={{ fontSize: 12 }}>Хянагч</Text></div>
                </div>
              </Flex>
            ))}
          </Flex>
        </Card>
      </div>

      {/* Meta sidebar */}
      <Flex vertical gap={12} style={{ width: 200 }}>
        {[
          { icon: <TeamOutlined />,       label: 'Удирдагч',    value: thesis.supervisor    },
          { icon: <BankOutlined />,       label: 'Тэнхим',      value: thesis.department   },
          { icon: <ExperimentOutlined />, label: 'Чиглэл',      value: thesis.researchArea },
          { icon: <CalendarOutlined />,   label: 'Хугацаа',     value: thesis.submissionDate },
        ].map((item, i) => (
          <Card key={i} size="small">
            <Statistic
              title={<Flex align="center" gap={4}>{item.icon}<span>{item.label}</span></Flex>}
              value={item.value}
              valueStyle={{ fontSize: 13, color: '#0f172a' }}
            />
          </Card>
        ))}
      </Flex>
    </div>
  );
}

// ─── ThesisView — main export ─────────────────────────────────────────────────

/**
 * ThesisView
 *
 * The single shared "Thesis" feature consumed by both module-teacher
 * and module-student via Module Federation.
 *
 * The `role` prop switches between two variants:
 *   - student: thesis info, progress tracker, file submission
 *   - teacher: supervised student list + review actions
 *
 * Usage inside module-teacher (after lazy loading):
 * ```tsx
 * const RemoteThesisView = React.lazy(() => import('module_thesis/ThesisView'));
 * <RemoteThesisView role="teacher" students={myStudents} onReviewReport={openDrawer} />
 * ```
 */
export default function ThesisView({
  role = 'student',
  thesis = DEFAULT_THESIS,
  students = [],
  onReviewReport,
  onSubmitReport,
}: ThesisViewProps) {
  const isTeacher = role === 'teacher';

  const headerStats = isTeacher
    ? [
        {
          label: 'Удирдаж буй',
          value: `${students.length} оюутан`,
          icon: <TeamOutlined />,
          accentColor: '#1455BD',
        },
        {
          label: 'Хүлээгдэж буй',
          value: `${students.filter((s) => s.status === 'Submitted').length} тайлан`,
          icon: <FileTextOutlined />,
          accentColor: '#d97706',
        },
      ]
    : [
        {
          label: 'Дэвшил',
          value: `${thesis.progress}%`,
          icon: <CheckCircleOutlined />,
          accentColor: '#1455BD',
        },
        {
          label: 'Удирдагч',
          value: thesis.supervisor,
          icon: <TeamOutlined />,
          accentColor: '#7c3aed',
        },
      ];

  const tabItems = isTeacher
    ? [
        {
          key: 'students',
          label: 'Оюутнуудын жагсаалт',
          icon: <TeamOutlined />,
          badge: students.filter((s) => s.status === 'Submitted').length,
          children: (
            <TeacherStudentTable students={students} onReview={onReviewReport} />
          ),
        },
      ]
    : [
        {
          key: 'overview',
          label: 'Тойм',
          children: <StudentOverviewTab thesis={thesis} />,
        },
        {
          key: 'submit',
          label: 'Тайлан илгээх',
          icon: <FileTextOutlined />,
          children: (
            <Card>
              <Paragraph type="secondary">
                Тайлан илгээх форм энд ачаалагдана. (Backend холболтын дараа нэмэгдэнэ.)
              </Paragraph>
              <Button type="primary" onClick={onSubmitReport}>
                Тайлан илгээх
              </Button>
            </Card>
          ),
        },
      ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 40 }}>
      <PageHeader
        title={
          isTeacher
            ? 'Удирдсан дипломын ажлууд'
            : thesis.title
        }
        description={
          isTeacher
            ? 'Өөрийн удирдаж буй оюутнуудын судалгааны ажлыг нэг дороос удирдах самбар.'
            : thesis.description
        }
        stats={headerStats}
        actions={
          !isTeacher ? (
            <StatusBadge status={thesis.status as any} localized />
          ) : undefined
        }
      />

      <div style={{ marginTop: 24 }}>
        <PortalTabs items={tabItems} />
      </div>
    </div>
  );
}
