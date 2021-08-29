export function getValueFromOptions(options, slug) {
  if (!options) {
    return;
  }
  let option = options.find((opt) => opt.slug === slug);
  if (option) {
    return option.value;
  }
}
