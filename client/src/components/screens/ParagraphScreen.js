import {
    Alert,
    Box,
    Button,
    Card,
    Collapse,
    Link,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
  } from "@mui/material";
  import React, { useState } from "react";
  import axios from "axios";
  
  const ParagraphScreen = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(min-width: 1000px)");
  
    const [text, setText] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [error, setError] = useState("");
  
    const paragraphHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post("/api/openai/paragraph", { text });
        setParagraph(data);
      } catch (err) {
        console.log(err);
        if (err.response.data.error) {
          setError(err.response.data.error);
        } 
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    };
  
    return (
      <Box
        width={isNonMobile ? "50%" : "90%"}
        p="2rem"
        m="2rem auto"
        borderRadius={5}
        backgroundColor={theme.palette.background.alt}
        sx={{ boxShadow: 5 }}
      >
        <Collapse in={error}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>
        <form onSubmit={paragraphHandler}>
          <Typography variant="h3" sx={{ mb: 2 }}>Paragraph Generator</Typography>
  
          <Stack direction="row" spacing={1}>
            <Box width="87%">
              <TextField
                fullWidth
                multiline="true"
                placeholder="Enter paragraph topic here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Box>
            <Button
              disableElevation
              variant="contained"
              type="submit"
              sx={{ color: "white" }}
            >
              Generate
            </Button>
          </Stack>
        </form>
        {paragraph ? (
          <Card
            sx={{
              mt: 4,
              p: 2,
              border: 1,
              boxShadow: 0,
              borderColor: "neutral.medium",
              borderRadius: 2,
              height: "500px",
              bgcolor: "background.default",
            }}
          >
            <Typography>{paragraph }</Typography>
          </Card>
        ) : (
          <Card
            sx={{
              mt: 4,
              p: 2,
              border: 1,
              boxShadow: 0,
              borderColor: "neutral.medium",
              borderRadius: 2,
              height: "500px",
              bgcolor: "background.default",
            }}
          >
            <Typography
              variant="h3"
              color="neutral.main"
              sx={{
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "450px",
              }}
            >
              Blurb will appear here
            </Typography>
          </Card>
        )}
        <Typography mt={2}>
          Not the tool you're looking for? <Link href="/">Go back</Link>
        </Typography>
      </Box>
    );
  };
  
  export default ParagraphScreen;
  