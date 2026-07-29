import { useEffect, useState } from "react";
import Select from "react-select";

export default function FormSearchSelect({
  label,
  value,
  loadOptions,
  onChange,
  required,
}) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  async function searchOptions(search = "") {
    try {
      const data = await loadOptions(search);
      setOptions(data);

      if (value) {
        const selected = data.find((o) => String(o.value) === String(value));

        if (selected) {
          setSelectedOption(selected);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    searchOptions("");
  }, []);

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <Select
        options={options}
        value={selectedOption}
        onInputChange={(input) => {
          searchOptions(input);
        }}
        onChange={(selected) => {
          setSelectedOption(selected);

          onChange({
            target: {
              name: label,
              value: selected?.value ?? "",
            },
          });
        }}
        isSearchable
        placeholder={`Search ${label}...`}
      />
    </div>
  );
}
