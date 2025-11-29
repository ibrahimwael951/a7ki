export const transition = {
  transition: { duration: 0.5},
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  exit: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
export const fadeDown = {
  initial: { opacity: 0, y: -20 },
  exit: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};
export const fadeLeft = {
  initial: { opacity: 0, x: -20 },
  exit: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};
export const fadeRight = {
  initial: { opacity: 0, x: 20 },
  exit: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};
export const fadeOnly = {
  initial: { opacity: 0 },
  exit: { opacity: 0 },
  animate: { opacity: 1 },
};
