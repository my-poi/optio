interface StringConstructor {
  format(...expression): string;
}

String.format = function(expression) {
  const args = Array.prototype.slice.call(arguments, 1);
  return expression.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== 'undefined'
      ? args[number]
      : match
    ;
  });
};
