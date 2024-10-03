import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import aiIcon from "../../assets/ais.svg";
import tsubuyakiIcon from "../../assets/tsubuyakiIcon.svg";
import {authenticationState} from "../../atoms/AuthenticationState";
import Typography from "@mui/material/Typography";

const TSUBUYAKI_ORIGIN = process.env.REACT_APP_TSUBUYAKI_ORIGIN as string;
// Inside your component
const FooterMenu = () => {
    // ビューモデル
    const [authentication] = useRecoilState(authenticationState);
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                backgroundColor: '#000000',
                overflowX: 'auto',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}>
            <List sx={{
                display: 'flex',
                overflowX: 'auto',
                width: "100%"
            }}>
                {[
                    {label: 'home', icon: <HomeIcon/>, linkPath: "/home"},
                    {label: 'Tsubuyaki', icon: <img src={tsubuyakiIcon}/>, linkPath: TSUBUYAKI_ORIGIN},
                    {label: 'AIS', icon: <img src={aiIcon}/>, linkPath: `/user/${authentication.uid}/ais`}
                ].map((item, index) => (
                    <ListItem key={item.label} disablePadding sx={{justifyContent: "center"}} onClick={() => {
                        if (item.linkPath === TSUBUYAKI_ORIGIN) {
                            window.open(item.linkPath, '_blank'); // 仮
                        } else {
                            navigate(item.linkPath);
                        }
                    }}>
                        <Box display={"block"} textAlign={"center"}>
                            {item.icon}
                            <Typography>
                                {item.label}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default FooterMenu;
