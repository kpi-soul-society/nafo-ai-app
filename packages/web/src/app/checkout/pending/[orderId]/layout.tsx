import UrqlContext from '@/components/common/UrqlContext';
import { WebSocketProvider } from '@/lib/contexts/WebSocketProvider';

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <UrqlContext>
      <WebSocketProvider>{children}</WebSocketProvider>
    </UrqlContext>
  );
}
