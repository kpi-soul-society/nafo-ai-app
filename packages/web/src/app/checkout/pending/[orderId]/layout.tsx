import UrqlContext from '@/components/common/UrqlContext';

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  return <UrqlContext>{children}</UrqlContext>;
}
