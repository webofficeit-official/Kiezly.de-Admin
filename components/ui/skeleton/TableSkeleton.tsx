import DraggableScroll from "../DragableScrollbar/DragableScrollBar";

type Props = {
  rows?: number;     
  columns?: number; 
};

export default function TableSkeleton({ rows = 8, columns = 9 }: Props) {
  return (
      <DraggableScroll className="p-4" horizontalOnly={true}>
      <table className="w-full animate-pulse">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4 border-y">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: columns }).map((_, col) => (
                <td key={col} className="p-4 border-b">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DraggableScroll>
  );
}
