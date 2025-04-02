import { Label } from "@radix-ui/react-label";
import { Link } from "react-router-dom";

interface TagType {
  id: string;
  name: string;
}

interface CardPostProps {
  slug: string;
  title: string;
  description?: string;
  tags: TagType[];
}

const CardPost = ({ slug, title, description, tags }: CardPostProps) => {
  return (
    <>
      <Link to={`/posts/${slug}`} className="flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-start border rounded-md p-4 gap-4 shadow-sm shadow-gray-400 dark:shadow-gray-800">
          <div className="flex flex-col gap-3 items-start justify-start w-full ">
            <div className="flex gap-3 items-end">
              <Label className="text-xl font-semibold" style={{ fontFamily: `"M PLUS Rounded 1c", sans-serif` }}>{title}</Label>
              <div className="flex gap-2">
                {tags?.map((tag) => (
                  <div key={tag.id} className="text-sm min-w-16 text-center text-gray-500 border rounded-md px-2 bg-gray-200 dark:bg-neutral-800">{tag.name}</div>
                ))}
              </div>
            </div>
            <div className="text-md text-gray-400">{description}</div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CardPost;
