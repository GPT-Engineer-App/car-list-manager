import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Stack, Flex, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Select, useToast } from "@chakra-ui/react";

const API_URL = "https://backengine-2dea.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [carMakers, setCarMakers] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [selectedMakerId, setSelectedMakerId] = useState("");
  const [modelName, setModelName] = useState("");
  const [editModelId, setEditModelId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchCarMakers();
    fetchCarModels();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.text();
        toast({
          title: "Login Failed",
          description: errorData,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
          title: "Signup Successful",
          description: "You can now login with your credentials",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.text();
        toast({
          title: "Signup Failed",
          description: errorData,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const fetchCarMakers = async () => {
    try {
      const response = await fetch(`${API_URL}/car-makers`);
      const data = await response.json();
      setCarMakers(data);
    } catch (error) {
      console.error("Error fetching car makers:", error);
    }
  };

  const fetchCarModels = async () => {
    try {
      const response = await fetch(`${API_URL}/car-models`);
      const data = await response.json();
      setCarModels(data);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const handleCreateMaker = async () => {
    try {
      const response = await fetch(`${API_URL}/car-makers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: "New Car Maker" }),
      });

      if (response.ok) {
        fetchCarMakers();
        toast({
          title: "Car Maker Created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to Create Car Maker",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating car maker:", error);
    }
  };

  const handleCreateModel = async () => {
    try {
      const response = await fetch(`${API_URL}/car-models`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ maker_id: selectedMakerId, name: modelName }),
      });

      if (response.ok) {
        fetchCarModels();
        setSelectedMakerId("");
        setModelName("");
        onClose();
        toast({
          title: "Car Model Created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to Create Car Model",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating car model:", error);
    }
  };

  const handleEditModel = async () => {
    try {
      const response = await fetch(`${API_URL}/car-models/${editModelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ maker_id: selectedMakerId, name: modelName }),
      });

      if (response.ok) {
        fetchCarModels();
        setSelectedMakerId("");
        setModelName("");
        setEditModelId(null);
        onClose();
        toast({
          title: "Car Model Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to Update Car Model",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating car model:", error);
    }
  };

  const openEditModal = (model) => {
    setSelectedMakerId(model.maker_id);
    setModelName(model.name);
    setEditModelId(model.id);
    onOpen();
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Car Makers and Models
      </Heading>

      {!isLoggedIn ? (
        <Stack spacing={4} maxWidth="400px" margin="auto">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleLogin}>Login</Button>
          <Button onClick={handleSignup}>Signup</Button>
        </Stack>
      ) : (
        <>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="lg">
              Car Makers
            </Heading>
            <Button onClick={handleCreateMaker}>Create Maker</Button>
          </Flex>

          {carMakers.map((maker) => (
            <Box key={maker.id} p={2} borderWidth={1} mb={2}>
              <Text>{maker.name}</Text>
            </Box>
          ))}

          <Flex justify="space-between" align="center" my={4}>
            <Heading as="h2" size="lg">
              Car Models
            </Heading>
            <Button onClick={onOpen}>Create Model</Button>
          </Flex>

          {carModels.map((model) => (
            <Box key={model.id} p={2} borderWidth={1} mb={2} cursor="pointer" onClick={() => openEditModal(model)}>
              <Text>{model.name}</Text>
            </Box>
          ))}

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{editModelId ? "Edit Car Model" : "Create Car Model"}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Car Maker</FormLabel>
                  <Select value={selectedMakerId} onChange={(e) => setSelectedMakerId(e.target.value)}>
                    <option value="">Select a car maker</option>
                    {carMakers.map((maker) => (
                      <option key={maker.id} value={maker.id}>
                        {maker.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Model Name</FormLabel>
                  <Input value={modelName} onChange={(e) => setModelName(e.target.value)} />
                </FormControl>
                <Button onClick={editModelId ? handleEditModel : handleCreateModel}>{editModelId ? "Update Model" : "Create Model"}</Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default Index;
