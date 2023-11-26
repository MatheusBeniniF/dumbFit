import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { BookUser } from "lucide-react";
import { Link } from "react-router-dom";

const UserCard = ({ member }) => {

  return (
    <div className="mb-4">
      <Card className="border border-gray-300 items-center px-4 !rounded-full shadow-md">
        <CardContent className="flex justify-between">
          <Typography color="text.secondary" className="flex items-center">
            {member?.email}
          </Typography>
          <div className="flex justify-end p-4">
            <Link to={`/cliente/${member.id}`}>
              <IconButton
                aria-label="add-ficha"
                className="text-green-500 hover:text-green-800"
              >
                <BookUser />
                Info
              </IconButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;
