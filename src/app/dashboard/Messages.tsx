export default function Messages({ messages }: { messages: string[] }) {
  return (
    <div>
      {messages.map((message, index) => {
        return <div key={index}>{message}</div>;
      })}
    </div>
  );
}
