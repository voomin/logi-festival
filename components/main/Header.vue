<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div class="container px-4 px-lg-5">
            <a class="navbar-brand" href="#page-top">로지 운동회</a>

            <div class="nav-item dropdown dropstart" id="memberBox1" style="display: none;">
                <button 
                    class="btn dropdown-toggle rounded-circle border-0" 
                    type="button" data-bs-toggle="dropdown" 
                    aria-expanded="false">
                    <img src="" alt="" id="profile-img" class="rounded-circle" style="width: 30px; height: 30px;">
                </button>
                <ul class="dropdown-menu col-lg-7" style="width: 15rem;">
                    <li>
                        <div class="row g-3 dropdown-item-text">
                            <div class="col-auto d-flex align-items-center">
                                <img src="" alt="" id="profile-img2" class="rounded-circle me-1" style="width: 50px; height: 50px;">

                                <div class="col-auto text-muted ms-1 text-wrap">
                                    <span id="name" class="mb-3">이름없음</span>
                                </div>
                            </div>
                            <div class="col-auto">
                              <!-- <label for="photoUrlInput" class="visually-hidden">Password</label> -->
                              <input type="text" class="form-control" id="photoUrlInput" placeholder="https://프로필_이미지_URL_경로">
                            </div>
                            <div class="col-auto">
                              <button type="submit" class="btn btn-outline-primary mb-3 btn-sm" onclick="clickPhotoUrlChange()">이미지 변경하기</button>
                              <!-- spinner -->
                                <div class="spinner-border text-primary" role="status" id="profileImgSpinner" style="display: none;">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <p id="email" class="dropdown-item-text">--@logibros.com</p>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <button
                            class="dropdown-item"
                            onclick="window.bm.auth.logout()"
                        >
                            로그아웃
                        </button>
                    </li>
                </ul>      
            </div>
            <!-- <button class="navbar-toggler" 
                type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown" id="memberBox1" style="display: none;">
                        
                    </li>
                </ul>
              </div> -->
        </div>
    </nav>
</template>

<script>
export default {

}
</script>

<style>

</style>