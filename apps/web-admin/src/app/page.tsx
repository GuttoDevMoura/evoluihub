import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona para a landing de vendas (web-marketing)
  redirect("http://localhost:3002/");
}
