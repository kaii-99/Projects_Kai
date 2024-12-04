package sudoku;
import java.util.List;
import java.util.Random;
import java.util.ArrayList;
/**
 * The Sudoku number puzzle to be solved
 */
public class Puzzle {
   // All variables have package access
   // The numbers on the puzzle
   int[][] numbers = new int[SudokuConstants.GRID_SIZE][SudokuConstants.GRID_SIZE];
   // The clues - isGiven (no need to guess) or need to guess
   boolean[][] isGiven = new boolean[SudokuConstants.GRID_SIZE][SudokuConstants.GRID_SIZE];

   // Constructor
   public Puzzle() {
      super();
   }

   // Generate a new puzzle given the number of cells to be guessed, which can be used
   //  to control the difficulty level.
   // This method shall set (or update) the arrays numbers and isGiven
   public void newPuzzle(int cellsToGuess) {
      // I hardcode a puzzle here for illustration and testing.
      //int[][] hardcodedNumbers =
      //   {{5, 3, 4, 6, 7, 8, 9, 1, 2},
      //    {6, 7, 2, 1, 9, 5, 3, 4, 8},
      //    {1, 9, 8, 3, 4, 2, 5, 6, 7},
      //    {8, 5, 9, 7, 6, 1, 4, 2, 3},
      //    {4, 2, 6, 8, 5, 3, 7, 9, 1},
      //    {7, 1, 3, 9, 2, 4, 8, 5, 6},
      //    {9, 6, 1, 5, 3, 7, 2, 8, 4},
      //    {2, 8, 7, 4, 1, 9, 6, 3, 5},
      //    {3, 4, 5, 2, 8, 6, 1, 7, 9}};
//
      //// Copy from hardcodedNumbers into the array "numbers"
      //for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) {
      //   for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
      //      numbers[row][col] = hardcodedNumbers[row][col];
      //   }
      //}

      Random random = new Random();
      List<List<Integer>> ColList = new ArrayList<>();
      for (int size = 0; size <= 8; size++) {
         List<Integer> innerColList = new ArrayList<>();
         for (int i = 1; i <= 9; i++) {
            innerColList.add(i);
         }
         ColList.add(innerColList);
      }

      List<List<Integer>> BoxList = new ArrayList<>();
      for (int size = 0; size <= 8; size++) {
         List<Integer> innerBoxList = new ArrayList<>();
         for (int i = 1; i <= 9; i++) {
            innerBoxList.add(i);
         }
         BoxList.add(innerBoxList);
      }
      

      // Generate a random puzzle
      for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) {
         boolean checked = false;
         List<Integer> InputRowList1 = new ArrayList<>();
         List<Integer> InputRowList2 = new ArrayList<>();

         List<Integer> RowList1 = new ArrayList<>();
         List<Integer> RowList2 = new ArrayList<>();
         // Initialize RowList with numbers 1 to 9
         for (int i = 1; i <= 9; i++) {
            RowList1.add(i);
            RowList2.add(i);
         }
         for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
            // Generate random numbers for the puzzle
            int randomNumber = random.nextInt(9) +1; // Random number between 1 and 9
            if (RowList1.indexOf(randomNumber) != -1) { // Check row number
               InputRowList1.add(randomNumber);
               RowList1.remove(RowList1.indexOf(randomNumber));
            }
            else {
               col -= 1;
            }
         }

         for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
            // Generate random numbers for the puzzle
            int randomNumber = random.nextInt(9) +1; // Random number between 1 and 9
            if (RowList2.indexOf(randomNumber) != -1) { // Check row number
               InputRowList2.add(randomNumber);
               RowList2.remove(RowList2.indexOf(randomNumber));
            }
            else {
               col -= 1;
            }
         }

         System.out.println("Row"+ row +": "+ InputRowList1);
         System.out.println("Row"+ row +": "+ InputRowList2);

         boolean check1 = false;
         boolean check2 = false;
         for (int input = 0; input < 9; input++) {
            int checknum = InputRowList1.get(input);
            if (ColList.get(input).indexOf(checknum) != -1) { // Check col number
               int boxIndex = (row / 3) * 3 + (input / 3);
               if (BoxList.get(boxIndex).indexOf(checknum) != -1) { // Check Box
                  numbers[row][input] = checknum;
                  System.out.print(checknum);
               }
               else {
                  break;
               }
            }
            else {
               break;
            }

            if (input == 8) {
               checked = true;
               check1 = true;
            }
         }

         System.out.println();
          if (!checked && !check1) {
            for (int input = 0; input < 9; input++) {
               int checknum = InputRowList2.get(input);
               if (ColList.get(input).indexOf(checknum) != -1) { // Check col number
                  int boxIndex = (row / 3) * 3 + (input / 3);
                  if (BoxList.get(boxIndex).indexOf(checknum) != -1) { // Check Box
                     numbers[row][input] = checknum;
                     System.out.print(checknum);
                  }
                  else {
                     row -= 1;
                     break;
                  }
               }
               else {
                  row -= 1;
                  break;
               }
   
               if (input == 8) {
                  checked = true;
                  check2 = true;
               }
            }
          }

         System.out.println();

         if (checked) {
            if (check1) {
               for (int col = 0; col < 9; col++) {
                  int checknum = InputRowList1.get(col);
                  int boxIndex = (row / 3) * 3 + (col / 3);
   
                  ColList.get(col).remove(ColList.get(col).indexOf(checknum));
                  BoxList.get(boxIndex).remove(BoxList.get(boxIndex).indexOf(checknum));
                  System.out.println("Col: " + ColList.get(col) + " input:" +checknum);
                  System.out.println("Box"+boxIndex+": " + BoxList.get(boxIndex));
                  //System.out.print(randomNumber);
               }
            }
            else if (check2) {
               for (int col = 0; col < 9; col++) {
                  int checknum = InputRowList2.get(col);
                  int boxIndex = (row / 3) * 3 + (col / 3);
   
                  ColList.get(col).remove(ColList.get(col).indexOf(checknum));
                  BoxList.get(boxIndex).remove(BoxList.get(boxIndex).indexOf(checknum));
                  System.out.println("Col: " + ColList.get(col) + " input:" +checknum);
                  System.out.println("Box"+boxIndex+": " + BoxList.get(boxIndex));
                  //System.out.print(randomNumber);
               }
            }
            else {

            } 
         }
      }

      // Need to use input parameter cellsToGuess!
      // Hardcoded for testing, only 2 cells of "8" is NOT GIVEN
      //boolean[][] hardcodedIsGiven =
      //   {{true, true, true, true, true, false, true, true, true},
      //    {true, true, true, true, true, true, true, true, false},
      //    {true, true, true, true, true, true, true, true, true},
      //    {true, true, true, true, true, true, true, true, true},
      //    {true, true, true, true, true, true, true, true, true},
      //    {true, true, true, true, true, true, true, true, true},
      //    {true, true, true, true, true, true, true, true, true},
      //    {true, true, true, true, true, true, true, true, true},
      //    {true, true, true, true, true, true, true, true, true}};
      
      // Copy from hardcodedIsGiven into array "isGiven"
      //for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) {
      //   for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
      //      isGiven[row][col] = hardcodedIsGiven[row][col];
      //   }
      //}
      
      for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) { // set all to True first
         for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
            isGiven[row][col] = true;
         }
      }

      for (int input = 0; input < cellsToGuess; input++){ // set selected number of cell to false
         int row = random.nextInt(9); // Random number between 1 and 9
         int col = random.nextInt(9); // Random number between 1 and 9
         isGiven[row][col] = false;
      }
   }

   //(For advanced students) use singleton design pattern for this class
}