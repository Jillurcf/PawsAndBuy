import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  // Button,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import StarRating from "react-native-star-rating-widget";
import tw from "twrnc"; // Tailwind styling library
import Button from '../components/Button';
import { useLazyGetTrackParcelQuery, usePostCreateRatingsMutation } from "../redux/api/apiSlice/apiSlice";
import { CustomAlert } from "./CustomAlert";

const MyOrderReview = ({
  item,
  // navigation,
  route,
}: {
  item: any;
  navigation: any;
  route: any;
}) => {
  const [postCreateRatings] = usePostCreateRatingsMutation();
  const [ratings, setRatings] = useState(0);
  const [review, setReview] = useState("");
  const [noReview, setNoReview] = useState(false);
  const { title } = route?.params || {};
  const navigation = useNavigation()
  const [alertVisible, setAlertVisible] = useState(false);
  const [getTrackParcel] = useLazyGetTrackParcelQuery();
  const reviewText = review;
  const showCustomAlert = () => {
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };
  const handleProductDetails = (id: number) => {
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }
    router.push({
      pathname: "/screens/productDetails/OrderProductDetails",
      params: { id: id }
    });
    console.log("Navigating to ProductDetails with ID:", id);
  };


  const handleRatingChange = (newRating: number) => {
    setRatings(Math.round(newRating));
  };

  const handleSubmitReview = async (item: any) => {
    console.log(item?.shipping?.parcel_id, "item +++++++++++++++++")
    console.log("Submitting review for Product ID:", item?.product_id);
    console.log("Seller ID:", item?.seller_id);
    setNoReview(true);
    if (!reviewText) {

      return console.error("Review text is empty");

    }

    try {
      const formData = new FormData();
      formData.append("rating", ratings.toString());
      formData.append("review", review);
      formData.append("products_id", item?.product_id);
      formData.append("seller_id", item?.seller_id);

      console.log("Form Data:", formData);

      const response = await postCreateRatings(formData).unwrap();
      console.log(response, "Response from API");
      if (response?.status === true) {
        setAlertVisible(true)
      }
      console.log("Response:", response);

    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleTrackParcel = async () => {
  console.log("handle track parcel click");

  const resTrackParcel = await getTrackParcel(item?.shipping?.parcel_id);
  console.log(resTrackParcel, "resTrackParcel +++++++++++++++++++");

  const trackingUrl = resTrackParcel?.data?.tracking?.tracking_url;
  console.log(trackingUrl, "tracking url+++++++++++++");

  if (trackingUrl) {
    // Recommended: open in external browser to bypass security headers
    await WebBrowser.openBrowserAsync(trackingUrl);
  } else {
    Alert.alert("Error", "Tracking URL not available.");
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={tw`border border-gray-200 rounded-xl mb-2 bg-primary100 ml-1 p-2`}
      // onPress={() => handleProductDetails(item?.id)}
      >
        {item?.product?.images && (
          <Image
            source={{ uri: item?.product?.images[0] }}
            style={tw`h-38 w-full rounded-xl`}
          />
        )}

        <TouchableOpacity style={tw`absolute top-5 right-5`}>
          {item?.seller?.avatar &&
            <Image
              source={{ uri: item?.seller?.avatar }}
              style={tw`h-6 w-6 rounded-full`}
            />
          }

        </TouchableOpacity>

        <View>
          <View style={tw`flex-row justify-between mt-1`}>
            <Text
              numberOfLines={1}
              style={tw`flex-1 text-title text-sm font-RoboBold`}
            >
              {item?.product?.title || "No Title"}
            </Text>
          </View>

          <View style={tw`flex-row justify-between mt-1`}>
            <Text style={tw`text-subT text-[10px] font-RoboNormal`}>
              Condition
            </Text>
            <Text style={tw`text-primary text-[10px] font-RoboNormal`}>
              {item?.product?.condition || "Unknown"}
            </Text>
          </View>

          <View style={tw`flex-row justify-between mt-1`}>
            <Text style={tw`text-title text-xs font-RoboNormal`}>
              €{item?.product?.price || "0.00"}
            </Text>
            <View style={tw`flex-row items-center gap-1`}>
              <Text style={tw`text-title text-xs font-RoboBold`}>
                €{item?.buyer_protection_fee || "0.00"}
              </Text>
            </View>
          </View>

          <View style={tw``}>
            <View style={tw`my-2 w-[70%]`}>
              <StarRating
                rating={ratings}
                onChange={(newRating: number) => handleRatingChange(newRating)}
                starSize={20}
                fullStarColor="#FFD700"
                emptyStarColor="#DDD"
              />
            </View>
            <View style={tw`w-[100%]`}>
              <TouchableOpacity
                onPress={handleTrackParcel}
                style={tw`border border-yellow-600 rounded-2xl items-center p-1`}>
                <Text style={tw`text-black text-xs`}>Track parcel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`my-4`}>
            <TextInput
              value={review}
              onChangeText={(value) => setReview(value)}
              placeholder="Type something here..."
              style={styles.textArea}
              placeholderTextColor="#888"
              multiline
            />
          </View>
          {!reviewText && noReview && (
            <Text style={tw`text-red-500 text-xs`}>
              Please enter your review*.
            </Text>
          )}

          <View style={tw``}>
            <Button

              title="Submit Review"
              onPress={() => handleSubmitReview(item)}
              color="#064145"
            />
          </View>
        </View>
      </TouchableOpacity>
      <CustomAlert
        visible={alertVisible}
        message="Your Review submitted"
        onClose={closeCustomAlert}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 14,
    height: 100,
  },
});

export default MyOrderReview;
