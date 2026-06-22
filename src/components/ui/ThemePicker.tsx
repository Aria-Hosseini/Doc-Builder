import useDocStore from "../../store/useDocStore";
import { themes } from "../../data/themes";

export default function ThemePicker() {
  const { meta, updateMeta } = useDocStore();
  return (
    <>
      {Object.entries(themes).map(([key, value]) => (
        <button
          key={key}
          onClick={() => updateMeta("theme", key)}
          className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
            meta.theme === key ? "border-white" : "border-zinc-700"
          }`}
          style={{ backgroundColor: value.background }}
        />
      ))}
    </>
  );
}
