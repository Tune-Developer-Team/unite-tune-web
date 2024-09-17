import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

import sample1 from '../../assets/sample1.jpg';
import sampleIcon1 from '../../assets/sampleIcon1.jpg';

interface SeedViewCardProps {
  seedId: string;
  title: string;
  description: string;
  ownerUserName?: string;
  imagePath?: any;
  userIconImagePath?: any;
  favoriteCount?: number;
}

const SeedViewCard = ({ seedId, title, description, ownerUserName, imagePath, userIconImagePath, favoriteCount }: SeedViewCardProps) => {

  return (
    <Card
      sx={{
        '&:hover': {
            boxShadow: 6,
            cursor: 'pointer',
            transform: 'scale(1.05)',
            background: '#333'
        },
        transition: 'transform 0.3s, box-shadow 0.3s',
        maxWidth: 345
      }}
      onClick={()=>{
        window.location.href=`/seed/${seedId}`
    }}>
      <CardHeader/>
      <CardMedia
        component="img"
        height="194"
        image={sample1}
        alt="imagePath"
      />
        <Typography variant="h5" color="text.secondary"
                    style={{position: "relative"}}
                    sx={{
                        backgroundColor: "rgba(0,0,0,0.59)",
                        color: "white",
                        marginTop: -20,
                        marginBottom: 15,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2
                    }}>{title}
        </Typography>
      <CardContent
      sx={{
        minHeight: '72px'
      }}>
        <Typography variant="body2" color="text.secondary"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2
        }}>{description}
        </Typography>
      </CardContent>
        <CardActions disableSpacing>
            <Avatar alt="userIcon" src={sampleIcon1}/>
            <IconButton aria-label="add to favorites">
                <FavoriteIcon/>
            </IconButton>
            <span>{favoriteCount}</span>
            <IconButton aria-label="share">
                <ShareIcon/>
            </IconButton>
        </CardActions>
    </Card>
  );
}

export default SeedViewCard;
