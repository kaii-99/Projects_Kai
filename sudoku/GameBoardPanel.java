package sudoku;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;   // Using Swing's components and containers
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;

import javax.sound.sampled.*;

public class GameBoardPanel extends JPanel{
    private static final long serialVersionUID = 1L;  // to prevent serial warning

   // Define named constants for UI sizes
   public static final int CELL_SIZE = 60;   // Cell width/height in pixels
   public static final int BOARD_WIDTH  = CELL_SIZE * SudokuConstants.GRID_SIZE;
   public static final int BOARD_HEIGHT = CELL_SIZE * SudokuConstants.GRID_SIZE;
                                             // Board width/height in pixels

   // Define properties
   /** The game board composes of 9x9 Cells (customized JTextFields) */
   private Cell[][] cells = new Cell[SudokuConstants.GRID_SIZE][SudokuConstants.GRID_SIZE];
   /** It also contains a Puzzle with array numbers and isGiven */
   private Puzzle puzzle = new Puzzle();

   /** Constructor */
   public GameBoardPanel() {
      super.setLayout(new GridLayout(SudokuConstants.GRID_SIZE, SudokuConstants.GRID_SIZE));  // JPanel

      // Allocate the 2D array of Cell, and added into JPanel.
      for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) {
         for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
            cells[row][col] = new Cell(row, col);
            super.add(cells[row][col]);   // JPanel
         }
      }

      // [TODO 3] Allocate a common listener as the ActionEvent listener for all the
      //  Cells (JTextFields)
      CellInputListener listener = new CellInputListener();

      // [TODO 4] Adds this common listener to all editable cells
      for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) {
         for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
            if (cells[row][col].isEditable()) {
               //listener.addKeyListener(this);
               cells[row][col].addKeyListener(listener);   // For all editable rows and cols
            }
         }
     }

      super.setPreferredSize(new Dimension(BOARD_WIDTH, BOARD_HEIGHT));
   }

   /**
    * Generate a new puzzle; and reset the game board of cells based on the puzzle.
    * You can call this method to start a new game.
    */
   public void newGame(int level) {
      // Generate a new puzzle
      if (level == 1) {
         puzzle.newPuzzle(2);
         SudokuMain.PrintHighScore();
      }
      else if (level == 2) {
         puzzle.newPuzzle(5);
         SudokuMain.PrintHighScore();
      }
      else {
         puzzle.newPuzzle(10);
         SudokuMain.PrintHighScore();
      }

      // Initialize all the 9x9 cells, based on the puzzle.
      for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) {
         for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
            cells[row][col].newGame(puzzle.numbers[row][col], puzzle.isGiven[row][col]);
         }
      }
   }

   /**
    * Return true if the puzzle is solved
    * i.e., none of the cell have status of TO_GUESS or WRONG_GUESS
    */
   public boolean isSolved() {
      for (int row = 0; row < SudokuConstants.GRID_SIZE; ++row) {
         for (int col = 0; col < SudokuConstants.GRID_SIZE; ++col) {
            if (cells[row][col].status == CellStatus.TO_GUESS || cells[row][col].status == CellStatus.WRONG_GUESS) {
               return false;
            }
         }
      }
      return true;
   }

   // [TODO 2] Define a Listener Inner Class for all the editable Cells
   private class CellInputListener implements KeyListener {
    @Override
    public void keyTyped(KeyEvent e) {
      // Get the typed character
      char inputChar = e.getKeyChar();

      // Check if the pressed key is the backspace key
      if (inputChar == KeyEvent.VK_BACK_SPACE) {
      // Handle backspace: clear the cell's content
      Cell sourceCell = (Cell)e.getSource();
      sourceCell.setText("");
      return; // Exit keyTyped method
  }

      // Retrieve the entered value from the cell
      String input = String.valueOf(inputChar);

       // Get a reference of the JTextField that triggers this action event
       Cell sourceCell = (Cell)e.getSource();

       /*
        * [TODO 5] (later - after TODO 3 and 4)
        * Check the numberIn against sourceCell.number.
        * Update the cell status sourceCell.status,
        * and re-paint the cell via sourceCell.paint().
        */
        if (isValidInput(input)) {
            // Retrieve the int entered
            int numberIn = Integer.parseInt(input);
            // For debugging
            System.out.println("You entered " + numberIn);
            
            // Check if the entered value is correct
            if (numberIn == sourceCell.number) {
                sourceCell.status = CellStatus.CORRECT_GUESS;
            } else {
                sourceCell.status = CellStatus.WRONG_GUESS;
            }
        } else {
            // Handle invalid input gracefully
            // For example, you can show a message dialog to inform the user
            JOptionPane.showMessageDialog(null, "Please enter a number between 1 and 9.", "Invalid Input", JOptionPane.ERROR_MESSAGE);
            return; // Exit actionPerformed method
        }
        sourceCell.paint();   // re-paint this cell based on its status

       /*
        * [TODO 6] (later)
        * Check if the player has solved the puzzle after this move,
        *   by calling isSolved(). Put up a congratulation JOptionPane, if so.
        */
        if (isSolved()) {
            SudokuMain.stopTimer();
            playSound();
            String playerName = JOptionPane.showInputDialog(null, "Congratulations! Enter your name:");
            if (playerName != null) {
               // Player entered a name, you can process it as needed
               SudokuMain.RecordScore(playerName);
               System.out.println("Player name: " + playerName);
               // Optionally, you can save the player's name to a file or perform other actions
            } else {
               // Player canceled the input dialog, handle it as needed
               System.out.println("Player canceled");
            }
            JOptionPane.showMessageDialog(null, "Congratulation!"); 
        }
    }
    // Validate user input to ensure it's within the acceptable range (1 to 9)
    private boolean isValidInput(String input) {
      for (char checkdigit : input.toCharArray()) {
         if(!Character.isDigit(checkdigit)) {
            return false;
         }
      }
      try {
         int number = Integer.parseInt(input);
         return number >= 1 && number <= 9;
     } catch (NumberFormatException e) {
         return false;
     }
   }

   private void playSound() {

      try {
         String filePath = "C:/Users/kaiwei/OneDrive - Nanyang Technological University/Y2Sem2/OOP/GUI/sudoku/complete.wav";
         File audioFile = new File(filePath);
         AudioInputStream aui = AudioSystem.getAudioInputStream(audioFile);
         
         try {
            Clip clip = AudioSystem.getClip();
            clip.open(aui);
            clip.start();
         } catch (Exception e) {

         }
      } catch (Exception e) {

      }
   }
 }
}
