import React, { useState, useEffect } from "react";
import { Container, VStack, Heading, Input, Button, List, ListItem, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

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
        body: JSON.stringify({ data: [{ name: newCity }] }),
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

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4}>
        <Heading mb={6}>City Manager</Heading>
        <Input placeholder="Add new city" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addCity} isLoading={loading}>
          Add City
        </Button>
        <List spacing={3} w="full">
          {cities.map((city) => (
            <ListItem key={city.id} d="flex" justifyContent="space-between" alignItems="center">
              {city.name}
              <IconButton aria-label="Delete city" icon={<FaTrash />} onClick={() => deleteCity(city.id)} colorScheme="red" />
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
