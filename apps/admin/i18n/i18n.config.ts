function choiceFn(count: number, choicesLength: number) {
  return () => {
    if (Math.min(count, choicesLength) !== count) {
      console.error(`unable to find i18n choice for count "${count}"`);
    }
    return count;
  };
}

export default defineI18nConfig(() => ({
  legacy: false,
  pluralRules: {
    ru(count, choicesLength) {
      const zero = choiceFn(0, choicesLength);
      if (count === 0) {
        return zero();
      }
      const one = choiceFn(1, choicesLength);
      const two = choiceFn(2, choicesLength);
      const many = choiceFn(3, choicesLength);
      return (count % 100 > 4 && count % 100 < 20)
        ? many()
        : [many, one, two, two, two, many][Math.min(count % 10, 5)]!();
    },
  },
}));
