console.log("start project");

type Gender = "male" | "female";

interface User {
  name: string;
  age: number;
  gender: Gender;
}

const user: User = { name: "John", age: 21, gender: "female" };

const fn = (a: number, b: number): number => {
  return a + b;
};

fn(1, 2);
