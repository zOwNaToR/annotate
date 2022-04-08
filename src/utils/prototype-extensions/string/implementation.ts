String.prototype.removeSpaces = function () {
  return this.replace(/\s/g, '');
};

String.prototype.removeChars = function (from: number, to: number) {
  return this.slice(0, from) + this.slice(to);
};

export default 1;
