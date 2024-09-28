import {styled} from "@mui/system";
import Avatar from "@mui/material/Avatar";

interface AvatarIconProps {
    isAvatarHovered: boolean; // Hover state prop
    // position: string;
}

export const AvatarIcon = styled(Avatar)<AvatarIconProps>(({ isAvatarHovered }) => ({
    position: "relative",
    margin: 8,
    zIndex: isAvatarHovered ? 100 : 2,  // Dynamically set zIndex based on hover state
    transition: "transform 0.2s ease-in-out, z-index 0.2s ease-in-out",
    "&:hover": {
        transform: "scale(1.5)",
    },
}));