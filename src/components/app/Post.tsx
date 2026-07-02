import Button from "../shared/Button"
import Card from "../shared/Card"
import Divider from "../shared/Divider"
import IconButton from "../shared/IconButton"

const Post = () => {
  return (
    <div className="space-y-3">
       {
        Array(20).fill(0).map((item, index)=>(
          <Card 
          key={index}
          >
            <div className="space-y-4">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat tenetur itaque earum iusto maiores voluptatum.
            </p>
          
            <div className="flex justify-between items-center">
              <label className="text-sm font-normal">jan 2, 2030 07:00 Pm</label>
                 <div className="flex gap-4">
                  <IconButton type="info" icon="edit-line" />
                  <IconButton type="danger" icon="delete-bin-4-line" />
                </div>
            </div>
           <Divider/>
           <div className='space-x-4'>
              <Button icon="thumb-up-line" type="info">20K</Button>
              <Button icon="thumb-down-line" type="warning">20K</Button>
              <Button icon="chat-ai-line" type="danger">20K</Button>
           </div>
          </div>
        </Card>
        ))
       }

    </div>
  )
}

export default Post
