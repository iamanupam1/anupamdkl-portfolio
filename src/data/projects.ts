export interface Project {
  id: string;
  tag: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  gradient: string;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'project-alpha',
    tag: 'Web App',
    title: 'Project Alpha',
    summary: 'A real-time collaboration platform for seamless team workflows.',
    description:
      'Built a real-time collaboration platform using WebSockets for instant syncing across users. Designed the frontend with React and the backend with Node.js, handling thousands of concurrent connections with graceful degradation.',
    techStack: ['React', 'Node.js', 'WebSockets', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 40%, #4c2889 100%)',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'dataflow-engine',
    tag: 'API Platform',
    title: 'DataFlow Engine',
    summary: 'High-performance data pipeline with sub-millisecond latency.',
    description:
      'Engineered a data pipeline processing millions of events per second. Built custom serialization for throughput optimization and implemented backpressure mechanisms to handle traffic spikes without data loss.',
    techStack: ['Python', 'Kafka', 'Redis', 'AWS'],
    gradient: 'linear-gradient(135deg, #0f1a2e 0%, #162544 40%, #1e3a5f 100%)',
    githubUrl: '#',
  },
  {
    id: 'devkit-cli',
    tag: 'Open Source',
    title: 'DevKit CLI',
    summary: 'Developer toolkit that automates common workflows.',
    description:
      'Created a CLI tool that automates repetitive developer tasks — scaffolding, linting setup, deployment configs. Designed a plugin architecture so the community can extend it. Used by thousands of developers.',
    techStack: ['Go', 'CLI', 'GitHub Actions'],
    gradient: 'linear-gradient(135deg, #0f2922 0%, #163d32 40%, #1a5244 100%)',
    liveUrl: '#',
    githubUrl: '#',
  },
];
