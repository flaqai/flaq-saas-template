import ArrowDown from './ArrowDown';

export default function SubHeading({
  children,
  rightNode,
}: {
  children: React.ReactNode;
  rightNode?: React.ReactNode;
}) {
  return (
    <div className='flex h-3.5 items-center gap-0.5 text-sm capitalize text-white'>
      {children}
      {/* <ArrowDown /> */}
      {rightNode}
    </div>
  );
}
