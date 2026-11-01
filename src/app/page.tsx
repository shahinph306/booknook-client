
import BannerSlider from "@/components/banner"
import HowBorrowingWorks from "@/components/HowBorrowingWorks"
import NewArrivalBooks from "@/components/NewArrivalBooks"
import TopCategories from "@/components/TopCategories"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col mx-auto container">
      
      <BannerSlider />
      <NewArrivalBooks />

      <HowBorrowingWorks />
      <TopCategories />
      
    </main>
  )
}
