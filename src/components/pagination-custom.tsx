import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationCustomProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationCustom({ totalPages, currentPage, onPageChange }: PaginationCustomProps) {
  const getPaginationItems = () => {
    const maxVisible = 5;
    const items = [];
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = startPage + maxVisible - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }
    }
    
    return items;
  };

  return (
    <Pagination className="select-none">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {getPaginationItems().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
              className={currentPage === page ? "font-bold text-white bg-primary" : "cursor-pointer"}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
