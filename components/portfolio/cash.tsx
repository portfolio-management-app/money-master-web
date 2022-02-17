import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { v4 as uuid } from 'uuid';
import { AiOutlineEuroCircle, AiOutlineDollarCircle } from 'react-icons/ai';
import { Link } from 'components';
import { getRandomPallete } from 'utils/color-scheme';

const categories = [
  {
    id: uuid(),
    content: 'USA Dollar',
    link: '/portfolio/cash',
    component: <AiOutlineDollarCircle style={{ height: '2rem', width: '2rem' }}  />,
    total: '€ 23 K',
    color: getRandomPallete(),
  },
  {
    id: uuid(),
    content: 'VietNam Dong',
    link: '/portfolio/cash',
    component: <Typography variant = 'body1' >VND</Typography>,
    total: 'VND 100 il ',
    color: getRandomPallete(),
  },
  {
    id: uuid(),
    content: 'Euro',
    link: '/portfolio/cash',
    component: <AiOutlineEuroCircle style={{ height: '2rem', width: '2rem' }} />,
    total: '$ 15 thsnd',
    color: getRandomPallete(),
  },
];


export default function Cash() {
  const [expanded, setExpanded] = React.useState(true);


  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
      }}
    >
      <Accordion expanded={expanded}>
        <AccordionSummary
          expandIcon={
            <IconButton onClick={() => setExpanded(!expanded)}>
              <ExpandMoreIcon />
            </IconButton>
          }
          aria-controls="panel1a-content"
          id="panel1a-header-cash"
        >
          <Typography variant = 'h5'>Cash</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Container maxWidth={false}>
            <Grid container spacing={3}>
              {categories.map((item) => {
                return (
                  <Grid key={item.id} item lg={4} sm={6} xl={4} xs={12}>
                    <Link href={item.link}>
                      <Card sx={{ border: '0.5rem' }}>
                        <CardContent>
                          <Grid
                            container
                            spacing={3}
                            sx={{ justifyContent: 'space-between' }}
                          >
                            <Grid item>
                              <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="h5"
                              >
                                {item.content}
                              </Typography>
                              <Typography color="textPrimary" variant="h5">
                                {item.total}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Avatar
                                sx={{
                                  backgroundColor: item.color,
                                  height: 56,
                                  width: 56,
                                }}
                              >
                                {item.component}
                              </Avatar>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
