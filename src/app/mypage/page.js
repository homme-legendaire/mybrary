import styles from "./page.module.css";
import Navigation from "@/components/Navigation";

export default function Find() {
  return (
    <div className={styles.container}>
      <h1>My Page</h1>
      <Navigation value={3} />
    </div>
  );
}
