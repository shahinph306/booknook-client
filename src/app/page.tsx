
import BannerSlider from "@/components/banner"
import Footer from "@/components/Footer"
import HowBorrowingWorks from "@/components/HowBorrowingWorks"
import NavbarPage from "@/components/navbar"
import TopCategories from "@/components/TopCategories"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col mx-auto container">
      <NavbarPage />
      <BannerSlider />


      <HowBorrowingWorks />
      <TopCategories />
      <Footer />
    </main>
  )
}
