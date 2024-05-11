import React, { useState, useEffect } from "react";
import { Container, VStack, Heading, Input, Button, List, Box, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit, FaCheck } from "react-icons/fa";

const API_URL = "https://sheetdb.io/api/v1/atvconiejzkc3";

const Index = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      toast({
        title: "Error fetching cities",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const addCity = async () => {
    if (!newCity) return;
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: [{ id: "INCREMENT", name: newCity }] }),
      });
      if (response.ok) {
        fetchCities();
        setNewCity("");
        toast({
          title: "City added",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error adding city",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleCityNameChange = (e, id) => {
    setCities(cities.map((city) => (city.id === id ? { ...city, name: e.target.value } : city)));
  };

  const toggleEdit = (id) => {
    setCities(cities.map((city) => (city.id === id ? { ...city, isEditing: !city.isEditing } : city)));
  };

  const deleteCity = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/id/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCities();
        toast({
          title: "City deleted",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting city",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const updateCity = async (id) => {
    const city = cities.find((c) => c.id === id);
    if (!city) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/id/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { name: city.name } }),
      });
      if (response.ok) {
        fetchCities();
        toast({
          title: "City updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error updating city",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4}>
        <Heading mb={6}>City Manager</Heading>
        <Input placeholder="Add new city" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addCity} isLoading={loading}>
          Add City
        </Button>
        <List spacing={3} w="full" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={6}>
          {cities.map((city) => (
            <Box key={city.id} p={4} boxShadow="md" borderWidth="1px" borderRadius="lg" bg="white" overflow="hidden">
              <Box bgImage="url('https://via.placeholder.com/150')" bgPosition="center" bgRepeat="no-repeat" bgSize="cover" height="150px" />
              <VStack p={4} alignItems="stretch" spacing={4}>
                <Input value={city.name} onChange={(e) => handleCityNameChange(e, city.id)} isReadOnly={!city.isEditing} />
                <HStack justifyContent="space-between">
                  <IconButton aria-label="Edit city" icon={<FaEdit />} onClick={() => toggleEdit(city.id)} colorScheme="blue" />
                  <IconButton aria-label="Delete city" icon={<FaTrash />} onClick={() => deleteCity(city.id)} colorScheme="red" />
                  <IconButton aria-label="Save city" icon={<FaCheck />} onClick={() => updateCity(city.id)} colorScheme="green" display={city.isEditing ? "inline-flex" : "none"} />
                </HStack>
              </VStack>
            </Box>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
