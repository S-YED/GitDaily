import { Button } from "@/components/ui/button";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterBar = ({ categories, activeCategory, onCategoryChange }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={
            activeCategory === category
              ? "glass-strong shadow-glow font-semibold transition-all duration-300 scale-105"
              : "glass hover:glass-strong hover:scale-105 hover:shadow-glow transition-all duration-300"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default FilterBar;
