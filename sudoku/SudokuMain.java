package sudoku;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;   // Using Swing's components and containers
import java.nio.file.*;
import java.util.List;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
 
// A Swing application extends from javax.swing.JFrame
public class SudokuMain extends JFrame {
   private static final long serialVersionUID = 1L;  // to prevent serial warning

   // private variables
   GameBoardPanel board = new GameBoardPanel();
   
   JButton btnNewGame = new JButton   ("New Game");

   JButton btnEasyButton = new JButton("      Easy     ");

   JButton btnMidButton = new JButton("    Normal   ");

   JButton btnHardButton = new JButton("      Hard     ");

   public static JPanel scorePanel = new JPanel();

   public static JLabel HighScoreLabel = new JLabel("HighScore");

   public static JLabel timerLabel = new JLabel("Time: 00:00");

   public static Timer timer;
   int seconds = 0;
   int minutes = 0;

   // Constructor
   public SudokuMain() {
      Container cp = getContentPane();
      cp.setLayout(new BorderLayout());

      JPanel buttonPanel = new JPanel();
      buttonPanel.setLayout(new BoxLayout(buttonPanel, BoxLayout.Y_AXIS));
      buttonPanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed
      
      scorePanel.setLayout(new BoxLayout(scorePanel, BoxLayout.Y_AXIS));
      scorePanel.setPreferredSize(new Dimension(100, 50)); // Set preferred size

      btnNewGame.addActionListener(new ActionListener() {
         @Override
         public void actionPerformed(ActionEvent e) {
            board.newGame(1); // Restart the game when the button is clicked
            resetTimer();
         }
      });
      buttonPanel.add(btnNewGame);
      // Add some space between buttons
      buttonPanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed

      btnEasyButton.addActionListener(new ActionListener() {
         @Override
         public void actionPerformed(ActionEvent e) {
            board.newGame(1); // Restart the game when the button is clicked
            resetTimer();
         }
      });
      buttonPanel.add(btnEasyButton);
      // Add some space between buttons
      buttonPanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed

      btnMidButton.addActionListener(new ActionListener() {
         @Override
         public void actionPerformed(ActionEvent e) {
            board.newGame(2); // Restart the game when the button is clicked
            resetTimer();
         }
      }); 
      buttonPanel.add(btnMidButton);
      // Add some space between buttons
      buttonPanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed

      btnHardButton.addActionListener(new ActionListener() {
         @Override
         public void actionPerformed(ActionEvent e) {
            board.newGame(3); // Restart the game when the button is clicked
            resetTimer();
         }
      });
      buttonPanel.add(btnHardButton);
      // Add some space between buttons
      buttonPanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed

      PrintHighScore();

      // Set layout for the SudokuMain frame
      setLayout(new BorderLayout());

      // Add the button panel to the west of the frame
      add(buttonPanel, BorderLayout.WEST);

      // Add the board to the center of the frame
      add(board, BorderLayout.CENTER);

      // Add the button panel to the west of the frame
      add(scorePanel, BorderLayout.EAST);

      // Start the timer
      timer = new Timer(1000, new ActionListener() {
         public void actionPerformed(ActionEvent evt) {
            updateTime();
         }
      });
      timer.start();

   
      // Initialize the game board to start the game
      board.newGame(1);

      pack();     // Pack the UI components, instead of using setSize()
      setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);  // to handle window-closing
      setTitle("Sudoku");
      setVisible(true);
   }

   public void updateTime() {
      seconds++;
      if (seconds == 60) {
         seconds = 0;
         minutes++;
      }
      String timeString = String.format("Time: %02d:%02d", minutes, seconds);
      timerLabel.setText(timeString);
   }

   public void resetTimer() {
      timer.stop();
      seconds = 0;
      minutes = 0;
      timerLabel.setText("Time: 00:00");
      timer.start();
   }

   public static void stopTimer() {
      timer.stop();
   }

   public static void PrintHighScore() {
      scorePanel.removeAll(); // Clear the panel before adding new scores
      // Timer label
      scorePanel.add(timerLabel);
      // Add some space between buttons
      scorePanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed

      //HighScore label
      scorePanel.add(HighScoreLabel);
      // Add some space between buttons
      scorePanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed

      // Specify the path to the text file
      Path filePath = Paths.get("highscore.txt");
      try {
         // Read all lines from the file into a List of Strings
         List<String> lines = Files.readAllLines(filePath);

         // Process each line to extract strings
         for (String line : lines) {
              // Here you can extract strings from each line as needed
              JLabel NameLabel = new JLabel(line);
              //HighScore Name label
              scorePanel.add(NameLabel);
              // Add some space between buttons
              scorePanel.add(Box.createVerticalStrut(10)); // Adjust the value as needed
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
      // Repaint the panel to reflect the changes
      scorePanel.revalidate();
      scorePanel.repaint();
   }

   public static void RecordScore(String playerName) {
      String time = timerLabel.getText().substring(6);
      try (BufferedWriter writer = new BufferedWriter(new FileWriter("highscore.txt", true))) {
         writer.write(playerName+" "+ time);
         writer.newLine(); // Add a new line for the next entry
     } catch (IOException e) {
         e.printStackTrace();
     }
     SortHighScore();
   }

   public static void SortHighScore() {
      // Specify the path to the text file
      Path filePath = Paths.get("highscore.txt");
      System.out.println("Sorting");
      try {
         // Read all lines from the file into a List of Strings
         List<String> lines = Files.readAllLines(filePath);
         // Process each line to extract strings
         for (int i = 0; i<lines.size()-1; i++) {
            System.out.println(lines);
            int min_index = i;
            for ( int j = i+1; j < lines.size(); j++) {
               String time1 = lines.get(min_index).split(" ")[1];
               String time2 = lines.get(j).split(" ")[1];
               System.out.println(time1.compareTo(time2));
               if(time1.compareTo(time2) > 0) {
                  min_index = j;
               }
            }
            String Swaptime = lines.get(min_index);
            lines.set(min_index, lines.get(i));
            lines.set(i, Swaptime);
         }
         System.out.println(lines);
         try (BufferedWriter writer = new BufferedWriter(new FileWriter("highscore.txt", false))) {
            for (int j = 0; j<lines.size(); j++) {
            writer.write(lines.get(j));
            writer.newLine();
            }
         } catch (IOException e) {
            e.printStackTrace();
         }
      } catch (Exception e) {
         e.printStackTrace();
      }
   }

   /** The entry main() entry method */
   public static void main(String[] args) {
      // [TODO 1] Check "Swing program template" on how to run
      //  the constructor of "SudokuMain"
      SwingUtilities.invokeLater(new Runnable() {
         @Override
         public void run() {
            new SudokuMain(); // Let the constructor does the job
         }
      });
   }
}