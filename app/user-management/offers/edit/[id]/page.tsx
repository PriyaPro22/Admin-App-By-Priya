useEffect(() => {
  if (params.id) {
    fetchSingleOffer();
  }
}, [params.id]);

const fetchSingleOffer = async () => {
  const res = await fetch(
    `https://api.bijliwalaaya.in/api/offers/${params.id}`,
    {
      headers: {
        "x-api-token": "super_secure_token"
      }
    }
  );

  const data = await res.json();

  if (data.success) {
    const offer = data.data;

    setDetails({
      title: offer.title,
      description: offer.description,
      link: ""
    });

    setPromo({
      code: offer.promocode,
      visible: offer.visibleToUser
    });

    setBannerImages([offer.imageUrl]);
    setVideos([offer.videoUrl]);
    setPromoImages([offer.promoLogo]);

    setDiscount({
      type: offer.discountType.type.toLowerCase(),
      value: offer.discountValue
    });

    setMinSpend({
      active: offer.min_spend > 0,
      value: offer.min_spend
    });
  }
};
