import { Button } from "@/components/ui/button";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterBar = ({ categories, activeCategory, onCategoryChange }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={
            activeCategory === category
              ? "bg-primary text-primary-foreground"
              : "hover:border-primary hover:text-primary"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default FilterBar;
