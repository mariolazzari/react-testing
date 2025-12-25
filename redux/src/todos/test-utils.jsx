import { render } from "@testing-library/react";
import { TodosContext } from "./contexts/todos";

export const customRender = (ui, providerProps) => {
  return render(
    <TodosContext.Provider value={providerProps}>{ui}</TodosContext.Provider>
  );
};
