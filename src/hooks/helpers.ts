export const getMarksToReplace = (inputContent: string) => {
   const marksMatcher = /({{ [a-zA-Z]*\/[a-zA-Z]{3,9} }})/g;

   let capturedFunctions;
   const functionToReplace = [];

   while ((capturedFunctions = marksMatcher.exec(inputContent)) !== null) {
      functionToReplace.push(capturedFunctions[1]);
   }

   return functionToReplace;
}

export const apiRequestHandler = (path: string) => fetch(path).then((response) => response.json());