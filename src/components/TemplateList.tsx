import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TemplateCard } from "@/api/templateCardApi";
import { Skeleton } from "@/components/ui/skeleton";
import BookLogo from "@/assets/img/Book_logo.svg";

interface TemplateListProps {
  templates?: TemplateCard[];
  isLoading: boolean;
  isError: boolean;
}

const TemplateList = ({
  templates = [],
  isLoading,
  isError,
}: TemplateListProps) => {
  const navigate = useNavigate();
  const handleTemplateClick = (id: string, templateData: any) => {
    navigate(`/template-management/${id}`, {
      state: { template: templateData, id: id },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="cursor-pointer">
              <div className="rounded-md flex flex-col items-center shadow-sm overflow-hidden w-[250px] h-[250px] border border-[#D9D8D8]">
                <div className="bg-[#E7F5FF] p-6 w-full flex justify-center items-center h-[150px]">
                  <Skeleton className="h-16 w-16 rounded" />
                </div>
                <div className="bg-white p-4 w-full h-[100px] flex flex-col">
                  <div className="text-left h-full flex flex-col justify-between">
                    <div>
                      <Skeleton className="h-5 w-16 mb-2 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="h-4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        Error loading templates. Please try again later.
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No templates found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 justify-items-center">
      {templates.map((template) => (
        <div
          key={template.id}
          className="cursor-pointer"
          onClick={() => handleTemplateClick(template.id)}
        >
          <div className="rounded-md flex flex-col items-center shadow-sm overflow-hidden w-[250px] h-[250px] border border-[#D9D8D8]">
            <div className="bg-[#E7F5FF] p-6 w-full flex justify-center items-center h-[150px]">
              <img src={BookLogo} alt="Document" className="w-16 h-16" />
            </div>
            <div className="bg-white p-4 w-full h-[100px] flex flex-col">
              <div className="text-left h-full flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.categories && template.categories.length > 0
                      ? template.categories.map(
                          (categoryItem: any, index: number) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-[#D4EDFF] text-[#00426E]"
                            >
                              {categoryItem.category.templateName}
                            </span>
                          )
                        )
                      : null}
                  </div>
                  <h3
                    className={`font-semibold text-black text-[18px] ${
                      !template.categories || template.categories.length === 0
                        ? "line-clamp-2"
                        : "line-clamp-1"
                    }`}
                    title={template.templateCardName}
                  >
                    {template.templateCardName}
                  </h3>
                </div>
                <div className="h-4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
