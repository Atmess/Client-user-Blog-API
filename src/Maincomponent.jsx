import Header from './component/Haeder';
import Mainpage from './component/Mainpage';

export default function Main() {
  
  return (
    <div className="min-h-screen "  >
      <Header />
      <div className='pt-20'>
      <Mainpage />
      </div>
    </div>
  );
}
