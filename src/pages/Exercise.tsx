import { useCallback, useEffect, useState } from 'react';
import { TemplateRenderer } from '@/components/molecules/TemplateRenderer';

// const socket = new WebSocket(`ws://localhost:${Bun.env.BUN_PORT || 3000}/socket`);
//
// function Counter() {
//   const [count, setCount] = useState(0);
//
//   useEffect(() => {
//     const onOpen = () => {
//       console.log('Connected');
//     };
//     socket.addEventListener('open', onOpen);
//
//     const onMessage = (message: MessageEvent) => {
//       setCount(x => x + 1);
//     };
//     socket.addEventListener('message', onMessage);
//
//     return () => {
//       socket.removeEventListener('open', onOpen);
//       socket.removeEventListener('message', onMessage);
//     };
//   });
//
//   const send = useCallback(() => {
//     socket.send('Test');
//   }, []);
//
//   return (
//     <div>
//       {count} <button onClick={send}>Clickity click</button>{' '}
//     </div>
//   );
// }

export function Exercise({ template }: { template: string }) {
  return <TemplateRenderer template={template} onSubmit={console.log} />;
}
