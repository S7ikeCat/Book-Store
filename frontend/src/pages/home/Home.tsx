import Banner from './Banner'
import TopSellers from './TopSellers'
import Recommended from './Recommended'
import News from './News'
import AllTableJsonBooks from './AllTableJsonBooks'


const Home = () => {
  return (
    <>
        <Banner/>
        <TopSellers/>
        <Recommended/>
        <AllTableJsonBooks/>
        <News/>
    </>
  )
}

export default Home