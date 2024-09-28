import {styled} from "@mui/system";
import Avatar from "@mui/material/Avatar";

export const AvatarIcon = styled(Avatar)<{ isAvatarHovered: boolean }>(({ isAvatarHovered }) => ({
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 8,
    zIndex: isAvatarHovered ? 100 : 2,  // Dynamically set zIndex based on hover state
    transition: "transform 0.2s ease-in-out, z-index 0.2s ease-in-out",
    "&:hover": {
        transform: "scale(1.5)",
    },
}));