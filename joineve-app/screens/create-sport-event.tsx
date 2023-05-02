import { useEffect, useMemo, useState } from "react";
import { Divider, ScrollView, Text, Toast, VStack, View } from "native-base";
import {
  Input,
  SelectInput,
  TextArea,
  DateTimeInput,
} from "../components/input";
import { useCurrentLocation, useForm, useGetSportTypes } from "../hooks";
import { handleAPIError } from "../util";
import { useNavigation } from "@react-navigation/native";
import { cities } from "../data/cities";
import { createSportEvent } from "../api";
import { parseISO, set } from "date-fns";
import { ROUTES } from "../constants";
import { Button } from "../components/button";
import MapView, { Marker } from "react-native-maps";
import { Loading } from "../components/loading";
import { Auth } from "../components/auth";

const CreateSportEventScreen = () => {
  const navigation = useNavigation<any>();
  const location = useCurrentLocation();

  const { values, onChange, errors, setValue, handleError } = useForm({
    name: "",
    sportTypeId: "",
    description: "",
    date: new Date().toISOString(),
    startAt: new Date().toISOString(),
    endAt: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
    maxParticipant: "10",
    addressStreet: "",
    addressCity: "",
    addressPostalCode: "",
    longitude: 0.0,
    latitude: 0.0,
  });

  useEffect(() => {
    if (location) {
      setValue({
        latitude: location.lat,
        longitude: location.long,
      });
    }
  }, [location]);

  const onSubmit = async () => {
    try {
      const {
        date,
        startAt,
        endAt,
        maxParticipant,
        latitude,
        longitude,
        ...restValues
      } = values;

      const currentDate = {
        year: parseISO(date).getFullYear(),
        month: parseISO(date).getMonth(),
        date: parseISO(date).getDate(),
      };

      const data = await createSportEvent({
        startAt: set(parseISO(startAt), currentDate).toISOString(),
        endAt: set(parseISO(endAt), currentDate).toISOString(),
        maxParticipant: Number(maxParticipant),
        latitude: String(latitude),
        longitude: String(longitude),
        ...restValues,
      });

      Toast.show({ title: "New event is created" });
      navigation.navigate(ROUTES.APP_TAB.HOME);
    } catch (error: any) {
      if (error.status)
        handleAPIError({ error, fieldErrorHandler: handleError });
    }
  };

  const { data: sportTypes, error: sportTypeError } = useGetSportTypes();

  const sportTypesOptions = useMemo(
    () =>
      (sportTypes || []).map(({ id, name }) => ({
        text: name,
        value: id,
      })),
    [sportTypes]
  );

  const cityOptions = useMemo(
    () =>
      cities.map(({ city }) => ({
        text: city,
        value: city,
      })),
    []
  );

  useEffect(() => {
    const error = sportTypeError;
    if (error) handleAPIError({ error, navigation });
  }, [sportTypeError]);

  if (location === null) return <Loading />;

  return (
    <Auth>
      <VStack flex={1} h="full" bgColor="white">
        <ScrollView h="full" pt="6" bgColor="white">
          <VStack px="5" space="3">
            <Text color="gray.800" fontWeight="500" fontSize="lg">
              Sport Event Details
            </Text>
            <VStack space="3">
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Event name
                </Text>
                <Input
                  placeholder="Event name"
                  value={values.name}
                  name="name"
                  errorText={errors.name}
                  onChangeText={onChange}
                />
              </View>
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Sport type
                </Text>
                <SelectInput
                  name="sportTypeId"
                  placeholder="Choose sport type"
                  options={sportTypesOptions}
                  value={values.sportTypeId}
                  errorText={errors.sportTypeId}
                  onChange={onChange}
                />
              </View>
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Max participant
                </Text>
                <Input
                  placeholder="Max participant"
                  value={values.maxParticipant}
                  name="maxParticipant"
                  errorText={errors.maxParticipant}
                  onChangeText={onChange}
                />
              </View>
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Event description
                </Text>
                <TextArea
                  placeholder="Event description"
                  value={values.description}
                  name="description"
                  errorText={errors.description}
                  onChangeText={onChange}
                />
              </View>
            </VStack>
            <Text color="gray.800" fontWeight="500" fontSize="lg" mt="5">
              Sport Event Schedule
            </Text>
            <VStack space="3">
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Event date
                </Text>
                <DateTimeInput
                  name="date"
                  value={values.date}
                  mode="date"
                  onChange={onChange}
                />
              </View>
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Event start time
                </Text>
                <DateTimeInput
                  name="startAt"
                  value={values.startAt}
                  mode="time"
                  errorText={errors.startAt}
                  onChange={onChange}
                />
              </View>
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Event end time
                </Text>
                <DateTimeInput
                  name="endAt"
                  value={values.endAt}
                  mode="time"
                  errorText={errors.endAt}
                  onChange={onChange}
                />
              </View>
            </VStack>
            <Text color="gray.800" fontWeight="500" fontSize="lg" mt="5">
              Sport Event Venue
            </Text>
            <VStack space="3">
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Venue city
                </Text>
                <SelectInput
                  name="addressCity"
                  placeholder="Choose the city"
                  options={cityOptions}
                  errorText={errors.addressCity}
                  value={values.addressCity}
                  onChange={onChange}
                />
              </View>
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Venue postal code
                </Text>
                <Input
                  placeholder="Venue address postal code"
                  value={values.addressPostalCode}
                  name="addressPostalCode"
                  errorText={errors.addressPostalCode}
                  onChangeText={onChange}
                />
              </View>
              <View>
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Venue address street
                </Text>
                <TextArea
                  placeholder="Venue address street"
                  value={values.addressStreet}
                  name="addressStreet"
                  errorText={errors.addressStreet}
                  onChangeText={onChange}
                />
              </View>
              <View h="96">
                <Text fontSize={14} mb={2} color="trueGray.700">
                  Venue pinpoint
                </Text>
                <MapView
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  region={{
                    latitude: values.latitude,
                    longitude: values.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.005,
                  }}
                >
                  <Marker
                    draggable
                    title="Pinpoint"
                    coordinate={{
                      latitude: values.latitude,
                      longitude: values.longitude,
                    }}
                    onDragEnd={(e) => {
                      onChange(e.nativeEvent.coordinate.latitude, "latitude");
                      onChange(e.nativeEvent.coordinate.longitude, "longitude");
                    }}
                  />
                </MapView>
              </View>
            </VStack>
          </VStack>
          <View h="20"></View>
        </ScrollView>
        <Divider />
        <VStack px="5" py="4">
          <Button onPress={onSubmit} text="Save" />
        </VStack>
      </VStack>
    </Auth>
  );
};

export default CreateSportEventScreen;
