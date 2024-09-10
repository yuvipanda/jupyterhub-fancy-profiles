export function hasDynamicImageBuilding(key, option) {
  return (
    key === "image" &&
    option.dynamic_image_building?.enabled &&
    option.unlisted_choice?.enabled
  );
}
