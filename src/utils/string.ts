export const cleanAiString = (data: string) => {
  return data.replace("```", "").replace("json", "").replace("```", "");
}