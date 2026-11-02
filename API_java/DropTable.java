import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DropTable {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/barber_shop?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true", "root", "");
            Statement stmt = conn.createStatement();
            stmt.executeUpdate("DROP TABLE reviews;");
            System.out.println("Table reviews dropped successfully.");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
