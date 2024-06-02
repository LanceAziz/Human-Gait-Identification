import Image from "next/image";
import secPic from '@/public/Pictures/All-Team/0.png';

interface Person {
    name: string;
    title: string;
    imageName: string;
    vip : boolean;
}
interface CardProps {
    personData: Person;
    image: string;
}

export default function Card({ personData, image}:CardProps) {
    return (
       
        <div className="p-2">
            <div className="row rounded rounded-4 bg-black">
                <div className="col-lg-4 d-flex justify-content-center rounded rounded-4 g-0 p-2">
                    {personData.imageName ?
                        <Image className={`w-100 h-auto rounded rounded-3`} width={300} height={300} src={image} alt={personData.name} /> :
                        <Image className={`w-100 h-auto rounded rounded-3`} width={300} height={300} src={secPic} alt={personData.name} />}
                </div>
                <div className="col-lg-8 d-flex align-items-center rounded rounded-4 g-0">
                    <div className='w-100 justify-content-center p-2 rounded rounded-4 bg-black text-white'>
                        <div className='w-100 py-1'>
                            <h5 className='m-0 fw-bold'>Name:</h5>
                            <span>{personData.name}</span>
                        </div>
                        <div className='w-100 py-1'>
                            <h5 className='m-0 fw-bold'>Title:</h5>
                            {personData.vip == true ? <span className="badge text-bg-light text-black rounded rounded-4 p-2 my-2">{personData.title}</span> :
                             <span>{personData.title}</span>}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}