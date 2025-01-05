import { useSearchParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stack } from "@/components/ui/stack";

const filters = [
  {
    view: "top",
    times: ["today", "week", "month", "year", "all-time"],
  },
  {
    view: "discussed",
    times: ["today", "week", "month", "year", "all-time"],
  },
  {
    view: "latest",
    times: [],
  },
];

export const PostFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get("view") || "latest";
  const time = searchParams.get("time") || "week";

  const updateSearchParams = (key: string, value: string) => {
    if (value !== "top") {
      searchParams.delete("time");
    }
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const currentFilter = filters.find((filter) => filter.view === view);

  return (
    <Stack
      $direction="vertical"
      $spacing={3}
      $styles={{
        position: "sticky",
        top: "-1rem",
        padding: 4,
        alignItems: ["center", "end", "end"],
        zIndex: "5",
        background: "colors.neutral.50",
      }}
    >
      <RadioGroup defaultValue={view}>
        {filters.map(({ view }) => (
          <RadioGroupItem
            value={view}
            key={view}
            onClick={(value) => updateSearchParams("view", value)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      {currentFilter?.times.length !== 0 ? (
        <RadioGroup defaultValue={time}>
          {currentFilter?.times.map((timeFilter) => (
            <RadioGroupItem
              value={timeFilter}
              key={timeFilter}
              onClick={(value) => updateSearchParams("time", value)}
            >
              {timeFilter.charAt(0).toUpperCase() +
                timeFilter.slice(1).replace("-", " ")}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      ) : null}
    </Stack>
  );
};
